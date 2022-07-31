using AzurePractice.Core.ConfigModels;
using AzurePractice.Core.Models;
using AzurePractice.Infrastructure.Data;
using LanguageExt;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Threading.Tasks;

namespace AzurePractice.CreateWalletFunction
{
    public class CreateWalletFunction
    {
        private readonly ApplicationDbContext _context;
        private readonly decimal _initialBalance;
        public CreateWalletFunction(ApplicationDbContext context, IOptions<DomainLogicSettings> domainLogic)
        {
            _context = context;
            _initialBalance = domainLogic.Value.InitialWalletBalance;
        }

        [FunctionName("CreateWallet")]
        public async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [CosmosDB(
                databaseName: "WalletsDb",
                collectionName: "ApplicationDbContext",
                ConnectionStringSetting = "CosmosDbSettings:ConnectionString")]
            IAsyncCollector<dynamic> collector)
        {
            return await Helpers.Parse<Wallet>(req)
                .Bind(wallet => CheckIfUnique(wallet))
                .Bind(wallet => SaveWallet(wallet, collector))
                .Match(
                wallet => new ObjectResult(wallet),
                ex => new BadRequestObjectResult(ex.Message));
        }

        private TryAsync<Wallet> CheckIfUnique(Wallet wallet)
        {
            return new TryAsync<Wallet>(async () =>
            {
                var anotherWallet = await _context.Wallets
                    .FirstOrDefaultAsync(it => it.Name == wallet.Name);
                if (anotherWallet != null)
                {
                    throw new Exception("wallet already exists");
                }
                return wallet;
            });
        }

        private TryAsync<Wallet> SaveWallet(Wallet wallet, IAsyncCollector<dynamic> collector)
        {
            return new TryAsync<Wallet>(async () =>
            {
                wallet.Balance = _initialBalance;
                wallet.id = Guid.NewGuid().ToString();
                wallet.CreatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                await collector.AddAsync(new
                {
                    Balance = wallet.Balance,
                    CreatedAt = wallet.CreatedAt,
                    id = Guid.NewGuid().ToString(),
                    Name = wallet.Name,
                    UserId = wallet.UserId,
                    Username = wallet.Username,
                    Discriminator = "Wallet"
                });

                return wallet;
            });
        }
    }
}
