namespace Api.Models.Api
{
    public class PaymentRequest
    {
        public int ProductsId { get; set; }
        public int? Quantity { get; set; }
    }
}