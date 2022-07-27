using AzurePractice.Core.ConfigModels;
using AzurePractice.Core.Models;
using AzurePractice.Infrastructure.Data;
using LanguageExt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public class WalletFunctions
    {
        private readonly ApplicationDbContext _context;
        private readonly decimal _initialBalance;
        public WalletFunctions(ApplicationDbContext context, IOptions<DomainLogicSettings> domainLogic)
        {
            _context = context;
            _initialBalance = domainLogic.Value.InitialWalletBalance;
        }

        [FunctionName("CreateWallet")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            return await Parse<Wallet>(req)
                .Bind(CheckIfUnique)
                .Bind(SaveWallet)
                .Match(
                wallet => new ObjectResult(wallet),
                ex => new BadRequestObjectResult(ex.Message));
        }

        [FunctionName("Wallets")]
        public async Task<IActionResult> RunWallets(
            [HttpTrigger(AuthorizationLevel.Function, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            return await new TryAsync<List<Wallet>>(async () =>
            {
                var userId = req.Query["userId"][0];
                return await _context.Wallets
                    .Where(it => userId.Equals(it.UserId) )
                    .ToListAsync();
            }).Match(
                wallets => new ObjectResult(wallets),
                ex => new BadRequestObjectResult("userId not specified"));
        }

        private TryAsync<T> Parse<T>(HttpRequest req)
        {
            return new TryAsync<T>(async () =>
            {
                string requestBody = await new StreamReader(req.Body)
                    .ReadToEndAsync();
                return JsonConvert.DeserializeObject<T>(requestBody);
            });
        }

        private TryAsync<Wallet> CheckIfUnique(Wallet wallet)
        {
            return new TryAsync<Wallet>(async () =>
            {
                if (await _context.Wallets.FirstOrDefaultAsync(it => it.Name == wallet.Name) != null)
                {
                    throw new Exception("wallet already exists");
                }
                return wallet;
            });
        }

        private TryAsync<Wallet> SaveWallet(Wallet wallet)
        {
            return new TryAsync<Wallet>(async () =>
            {
                wallet.Balance = _initialBalance;
                wallet.id = Guid.NewGuid().ToString();
                wallet.CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                await _context.Wallets.AddAsync(wallet);
                await _context.SaveChangesAsync();

                return wallet;
            });
        }
    }
}
