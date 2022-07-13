using AzurePractice.Core.ConfigModels;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AzurePractice.Core
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddCoreApplication(
            this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<DomainLogicSettings>(
                bind => configuration.GetSection(nameof(DomainLogicSettings))
                .Bind(bind));

            return services;
        }
    }
}
