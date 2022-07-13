using AzurePractice.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AzurePractice.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        public DbSet<Wallet> Wallets { get; set; }
    }
}
