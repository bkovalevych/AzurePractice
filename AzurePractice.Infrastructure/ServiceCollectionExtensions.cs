using AzurePractice.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AzurePractice.Infrastructure
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseCosmos(configuration["CosmosDbSettings:Endpoint"],
                    configuration["CosmosDbSettings:Key"],
                    configuration["CosmosDbSettings:DataBase"]);
            });

            services.AddDbContext<TransactionsDbContext>(options =>
            {
                options.UseCosmos(configuration["CosmosDbSettings:Endpoint"],
                    configuration["CosmosDbSettings:Key"],
                    configuration["CosmosDbSettings:DataBase"]);
            });
            return services;
        }
    }
}