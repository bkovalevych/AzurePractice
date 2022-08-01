using AzurePractice.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public static class GetChartsFunction
    {
        [FunctionName("Charts")]
        public static async Task<IActionResult> GetCharts(
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
                    select new { ids, fromT, toT };
            return await t.MatchAsync(
                (paramVar) => GetCharts(client, paramVar.ids, paramVar.fromT[0], paramVar.toT[0]),
                Helpers.HandleException);
        }

        private static async Task<IActionResult> GetCharts(IDocumentClient client, List<string> walletIds,
            long fromTimespan,
            long toTimespan)
        {
            var groupedTransactions = (await Helpers.QueryTransactions(client, walletIds, fromTimespan, toTimespan))
                .Where(it => it.Type == "expense")
                .GroupBy(key => key.WalletId,
                (key, walletGrouping) => new
                {
                    WalletId = key,
                    Expenses = new
                    {
                        Labels = DistinctLabels(walletGrouping),
                        Datasets = new[]
                        {
                            new
                            {
                                Label = "Expenses",
                                Data = GetData(walletGrouping)
                            }
                        }
                    }
                });

            return new ObjectResult(groupedTransactions);
        }

        private static IEnumerable<string> DistinctLabels(IEnumerable<WalletTransaction> walletGrouping)
        {
            return walletGrouping.Select(x => x.Topic)
                .Distinct();
        }

        private static decimal GetSumByTopic(IEnumerable<WalletTransaction> walletGrouping, string topic)
        {
            return walletGrouping.Where(it => it.Topic == topic)
                .Sum(it => it.Amount);
        }

        private static IEnumerable<decimal> GetData(IEnumerable<WalletTransaction> walletGrouping)
        {
            return DistinctLabels(walletGrouping)
                .Select(topic => GetSumByTopic(walletGrouping, topic));
        }
    }
}
