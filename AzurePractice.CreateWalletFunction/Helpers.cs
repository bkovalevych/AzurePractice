using AzurePractice.Core.Models;
using LanguageExt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public static class Helpers
    {
        public static TryAsync<T> Parse<T>(HttpRequest req)
        {
            return new TryAsync<T>(async () =>
            {
                string requestBody = await new StreamReader(req.Body)
                    .ReadToEndAsync();
                return JsonConvert.DeserializeObject<T>(requestBody);
            });
        }

        public static Try<List<T>> ValidateAndGetQueryParam<T>(HttpRequest req, string key)
        {
            return new Try<List<T>>(() =>
            {
                if (!req.Query.ContainsKey(key))
                {
                    throw new Exception(key + " is required");
                }
                
                return req.Query[key].Select(it => (T)Convert.ChangeType(it, typeof(T))).ToList();
            });
        }

        public static async Task<IActionResult> HandleException(Exception err)
        {
            return new BadRequestObjectResult(new
            {
                Messages = new[]
                 {
                    err.Message
                },
                IsSucceded = false
            });
        }

        public static async Task<List<WalletTransaction>> QueryTransactions(
            IDocumentClient client,
            List<string> walletIds, 
            long fromTimespan, 
            long toTimespan)
        {
            var collectionUri = UriFactory.CreateDocumentCollectionUri("WalletsDb", "TransactionsDbContext");

            var parameters = new SqlParameterCollection
            {
                new SqlParameter("@walletIds", walletIds),
                new SqlParameter("@fromTimespan", fromTimespan),
                new SqlParameter("@toTimespan", toTimespan)
            };

            var t = new SqlQuerySpec()
            {
                QueryText = "SELECT * FROM c WHERE c.Discriminator = 'WalletTransaction' " +
                "AND ARRAY_CONTAINS(@walletIds, c.WalletId) " +
                "AND c.CreatedAt >= @fromTimespan AND c.CreatedAt <= @toTimespan",
                Parameters = parameters
            };

            var query = client.CreateDocumentQuery<WalletTransaction>(collectionUri, t, new FeedOptions()
            {
                EnableCrossPartitionQuery = true
            }).AsDocumentQuery();
            
            var result = new List<WalletTransaction>();
            while (query.HasMoreResults)
            {
                foreach (WalletTransaction transaction in await query.ExecuteNextAsync())
                {
                    result.Add(transaction);
                }
            }

            return result;
        }
    }
}
