using AzurePractice.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public static class GetTimeChartsFunction
    {
        [FunctionName("TimeCharts")]
        public static async Task<IActionResult> GetTimeCharts(
                [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
                [CosmosDB(
                databaseName: "WalletsDb",
                collectionName: "TransactionsDbContext",
                ConnectionStringSetting = "CosmosDbSettings:ConnectionString"
            )] IDocumentClient client)
        {
            var t = from ids in Helpers.ValidateAndGetQueryParam<string>(req, "walletIds")
                    from fromT in Helpers.ValidateAndGetQueryParam<long>(req, "fromTimespan")
                    from toT in Helpers.ValidateAndGetQueryParam<long>(req, "toTimespan")
                    from tr in Helpers.ValidateAndGetQueryParam<long>(req, "timeRange")
                    select new { ids, fromT, toT, tr };
            
            return await t.MatchAsync(
                vars => GetTimeCharts(
                    client,
                    vars.ids,
                    vars.fromT[0],
                    vars.toT[0],
                    vars.tr[0]),
                Helpers.HandleException);
        }

        private static async Task<IActionResult> GetTimeCharts(IDocumentClient client, 
            List<string> walletIds,
            long fromTimespan,
            long toTimespan,
            long timeRange)
        {
            var transactions = await Helpers.QueryTransactions(client, walletIds, fromTimespan, toTimespan);

            var labels = GetLabels(toTimespan, fromTimespan, timeRange);
            var result = transactions.GroupBy(it => it.WalletId,
                (walletId, walletGrouping) => new
                {
                    WalletId = walletId,
                    Expenses = new
                    {
                        Labels = labels,
                        Datasets = DistinctTransactions(walletGrouping)
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

        private static IEnumerable<long> GetLabels(long toTimespan, long fromTimespan, long timeRange)
        {
            int countLabels = (int)((toTimespan - fromTimespan) / timeRange) + 1;
            return Enumerable.Range(0, countLabels)
                .Select(index => fromTimespan + index * timeRange);
        }

        private static IEnumerable<WalletTransaction> DistinctTransactions(
            IEnumerable<WalletTransaction> transactionsGrouping)
        {
            return transactionsGrouping.Where(it => it.Type == "expense")
                        .DistinctBy(it => it.Topic);
        }
    }
}
