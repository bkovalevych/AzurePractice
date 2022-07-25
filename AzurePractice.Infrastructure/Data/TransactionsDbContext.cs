using AzurePractice.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AzurePractice.Infrastructure.Data
{
    public class TransactionsDbContext : DbContext
    {
        public TransactionsDbContext(DbContextOptions<TransactionsDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<WalletTransaction> WalletTransactions { get; set; }
    }
}
