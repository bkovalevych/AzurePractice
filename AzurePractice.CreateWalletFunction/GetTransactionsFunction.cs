using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public static class GetTransactionsFunction
    {
        [FunctionName("Transactions")]
        public static async Task<IActionResult> GeTransactions(
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
            return await t.MapAsync(
                (paramVar) => Helpers.QueryTransactions(
                    client, 
                    paramVar.ids, 
                    paramVar.fromT[0], 
                    paramVar.toT[0]))
                .Match(result => new ObjectResult(result), Helpers.HandleException);
        }
    }
}
