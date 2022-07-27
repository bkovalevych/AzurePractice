namespace AzurePractice.Core.Models
{
    public class WalletTransaction : BaseModel
    {
        public string WalletId { get; set; }
        public string Type { get; set; }
        public string Topic { get; set; }
        public decimal Amount { get; set; }
        public decimal Tax { get; set; }
    }
}
