using AzurePractice.Infrastructure;
using AzurePractice.Core;

using Microsoft.Azure.Functions.Extensions.DependencyInjection;

[assembly: FunctionsStartup(typeof(AzurePractice.CreateWalletFunction.Startup))]
namespace AzurePractice.CreateWalletFunction
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {
            var configuration = builder.GetContext().Configuration;
            builder.Services.AddInfrastructure(configuration);
            builder.Services.AddCoreApplication(configuration);
        }
    }
}
