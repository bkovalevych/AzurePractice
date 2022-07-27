using AzurePractice.Api.Requests;
using AzurePractice.Core.Models;
using AzurePractice.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AzurePractice.Api.Controllers
{

    public class UserEmailsController : ControllerBaseApi
    {
        public UserEmailsController(ApplicationDbContext applicationDbContext) : base(applicationDbContext)
        {
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserEmail(string userId)
        {
            var userEmail = await AppDbContext
                    .UserEmails
                    .FirstOrDefaultAsync(userEmail => userEmail.UserId == userId.ToString());
            if (userEmail != null)
            {
                return new ObjectResult(userEmail);
            }
            return new BadRequestObjectResult("Not found");
        }

        [HttpPut]
        public async Task<IActionResult> SetUserEmail([FromBody] SetUserEmailRequest setRequest)
        {
            var userEmailValue = await AppDbContext
                    .UserEmails
                    .FirstOrDefaultAsync(userEmail => userEmail.UserId == userEmail.UserId);
            if (userEmailValue != null)
            {
                userEmailValue.Email = setRequest.Email;
                AppDbContext.UserEmails.Update(userEmailValue);
            }
            else
            {
                var newUserEmail = new UserEmail()
                {
                    Email = setRequest.Email,
                    UserId = setRequest.UserId,
                    id = Guid.NewGuid().ToString(),
                };
                await AppDbContext.UserEmails.AddAsync(newUserEmail);
            }
            await AppDbContext.SaveChangesAsync();

            return new ObjectResult(setRequest);
        }
    }
}
