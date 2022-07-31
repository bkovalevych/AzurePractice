using AzurePractice.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Collections.Generic;

namespace AzurePractice.CreateWalletFunction
{
    public static class GetWalletsFunction
    {
        [FunctionName("Wallets")]
        public static IActionResult GetnWallets(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = "wallets/{userId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "WalletsDb",
                collectionName: "ApplicationDbContext",
                ConnectionStringSetting = "CosmosDbSettings:ConnectionString",
                SqlQuery = "SELECT * FROM c " +
                "WHERE c.Discriminator = 'Wallet' AND c.UserId = {userId} " +
                "ORDER BY c.CreatedAt DESC")]
            IEnumerable<Wallet> wallets)
        {
            return new ObjectResult(wallets);
        }
    }
}
