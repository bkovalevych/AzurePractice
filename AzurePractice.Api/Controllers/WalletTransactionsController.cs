using AzurePractice.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AzurePractice.Api.Controllers
{
    public class WalletTransactionsController : ControllerBaseApi
    {
        private readonly TransactionsDbContext _transactionsContext;

        public WalletTransactionsController(ApplicationDbContext applicationDbContext, TransactionsDbContext transactionsDbContext) : base(applicationDbContext)
        {
            _transactionsContext = transactionsDbContext;
        }

        [HttpGet("{walletId}")]
        public async Task<IActionResult> GetUserEmail(string walletId)
        {
            var transactions = await _transactionsContext
                    .WalletTransactions
                    .Where(transaction => transaction.WalletId == walletId)
                    .ToListAsync();
            if (transactions != null)
            {
                return new ObjectResult(transactions);
            }
            return new BadRequestObjectResult("Not found");
        }
    }
}
