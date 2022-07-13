namespace AzurePractice.Core.Models
{
    public class Wallet : BaseModel
    {
        public string Name { get; set; }

        public string UserId { get; set; }

        public string Username { get; set; }

        public decimal Balance { get; set; }
    }
}
