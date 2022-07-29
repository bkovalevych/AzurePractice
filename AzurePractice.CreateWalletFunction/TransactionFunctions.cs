using AzurePractice.Core.Models;
using AzurePractice.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public class TransactionFunctions
    {
        private readonly TransactionsDbContext _context;

        public TransactionFunctions(TransactionsDbContext context)
        {
            _context = context;
        }

        [FunctionName("Transactions")]
        public async Task<IActionResult> GeTransactions(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            if (!req.Query.ContainsKey("walletIds") ||
                !req.Query.ContainsKey("fromTimespan") ||
                !req.Query.ContainsKey("toTimespan"))
            {
                return new BadRequestObjectResult(new 
                { 
                    Messages = new[] 
                    { 
                        "Either walletIds or fromTimespan or toTimespan are not specified" 
                    },
                    IsSucceded = false
                });
            }
            var walletIds = req.Query["walletIds"].ToList();
            long fromTimespan = long.Parse(req.Query["fromTimespan"][0]);
            long toTimespan = long.Parse(req.Query["toTimespan"][0]);
            
            if (walletIds == null || walletIds.Count == 0)
            {
                return new NotFoundObjectResult(new
                {
                    Messages = new[]
                    {
                        "Not found"
                    },
                    IsSucceded = false
                });
            }
            var transactions = await QueryTransactions(walletIds, fromTimespan, toTimespan)
                    .ToListAsync();

            return new ObjectResult(transactions);
        }    

        [FunctionName("Charts")]
        public async Task<IActionResult> GetCharts(
                [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
                ILogger log)
        {
            if (!req.Query.ContainsKey("walletIds") ||
                !req.Query.ContainsKey("fromTimespan") ||
                !req.Query.ContainsKey("toTimespan"))
            {
                return new BadRequestObjectResult(new
                {
                    Messages = new[]
                    {
                            "Either walletIds or fromTimespan or toTimespan are not specified"
                        },
                    IsSucceded = false
                });
            }
            var walletIds = req.Query["walletIds"].ToList();
            long fromTimespan = long.Parse(req.Query["fromTimespan"][0]);
            long toTimespan = long.Parse(req.Query["toTimespan"][0]);

            if (walletIds == null || walletIds.Count == 0)
            {
                return new NotFoundObjectResult(new
                {
                    Messages = new[]
                    {
                            "Not found"
                        },
                    IsSucceded = false
                });
            }
            var groupedTransactions = (await QueryTransactions(walletIds, fromTimespan, toTimespan)
                    .ToListAsync()).Where(it => it.Type == "expense")
                    .GroupBy(key => key.WalletId,
                    (key, walletGrouping) => new {
                        WalletId = key,
                        Expenses = new 
                        {
                            Labels = walletGrouping.Select(x => x.Topic).Distinct(),
                            Datasets = new []
                            {
                                new
                                {
                                    Label = "Expenses",
                                    Data = walletGrouping.Select(x => x.Topic).Distinct()
                                    .Select(topic => walletGrouping.Where(it => it.Topic == topic).Sum(it => it.Amount))
                                }
                            }
                        } 
                    });

            return new ObjectResult(groupedTransactions);
        }

        [FunctionName("TimeCharts")]
        public async Task<IActionResult> GetTimeCharts(
                [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
                ILogger log)
        {
            if (!req.Query.ContainsKey("walletIds") ||
                !req.Query.ContainsKey("fromTimespan") ||
                !req.Query.ContainsKey("toTimespan") ||
                !req.Query.ContainsKey("timeRange"))
            {
                return new BadRequestObjectResult(new { Messages = new[] { "Either walletIds or fromTimespan or toTimespan or timeRange are not specified"}, IsSucceded = false});
            }

            var walletIds = req.Query["walletIds"].ToList();
            long fromTimespan = long.Parse(req.Query["fromTimespan"][0]);
            long toTimespan = long.Parse(req.Query["toTimespan"][0]);
            long timeRange = long.Parse(req.Query["timeRange"][0]);

            if (walletIds == null || walletIds.Count == 0)
            {
                return new NotFoundObjectResult(new { Messages = new[] { "Not found"}, IsSucceded = false });
            }
            
            var transactions = await QueryTransactions(walletIds, fromTimespan, toTimespan)
                .ToListAsync();

            var labels = Enumerable.Range(0, (int)((toTimespan - fromTimespan) / timeRange) + 1)
                .Select(index => fromTimespan + index * timeRange);
            var result = transactions.GroupBy(it => it.WalletId,
                (walletId, walletGrouping) => new
                {
                    WalletId = walletId,
                    Expenses = new
                    {
                        Labels = labels,
                        Datasets = walletGrouping.Where(it => it.Type == "expense")
                        .DistinctBy(it => it.Topic)
                        .Select(dataSet => new
                        {
                            Label = dataSet.Topic,
                            Data = labels.GroupJoin(
                                walletGrouping.Where(it => it.Type == "expense" && it.Topic == dataSet.Topic),
                                outer => outer,
                                inner => inner.CreatedAt - (inner.CreatedAt - fromTimespan) % timeRange,
                                (timeSpan, units) => units.Sum(selector => selector.Amount))
                        })
                    },
                    Invoices = new
                    {
                        Labels = labels,
                        Datasets = new[]
                        {
                            new
                            {
                                Label = "income",
                                Data = labels.GroupJoin(
                                    walletGrouping.Where(it => it.Type == "invoice"),
                                    outer => outer,
                                    inner => inner.CreatedAt - (inner.CreatedAt - fromTimespan) % timeRange,
                                    (timeSpan, units) => units.Sum(selector => selector.Amount))
                            }
                        }
                    }
                });
            return new ObjectResult(result);
        }

        private IQueryable<WalletTransaction> QueryTransactions(
                List<string> walletIds,
                long fromTimespan,
                long toTimespan)
            {
                return _context
                        .WalletTransactions
                        .Where(transaction => walletIds.Contains(transaction.WalletId))
                        .Where(transaction => fromTimespan <= transaction.CreatedAt)
                        .Where(transaction => toTimespan >= transaction.CreatedAt)
                        .OrderByDescending(transaction => transaction.CreatedAt);
            }
        }
}
