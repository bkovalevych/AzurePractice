using AzurePractice.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;

namespace AzurePractice.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public abstract class ControllerBaseApi : ControllerBase
    {
        public ControllerBaseApi(ApplicationDbContext applicationDbContext)
        {
            AppDbContext = applicationDbContext;
        }

        protected ApplicationDbContext AppDbContext;
    }
}
