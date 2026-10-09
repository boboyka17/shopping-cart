namespace Api.Models.Api
{
    public class ProductsResponse
    {
        public int ProductsId { get; set; }

        public string? ProductName { get; set; }

        public decimal? ProductPrice { get; set; }

        public string? ProductImage { get; set; }

        public int? Quantity { get; set; }
    }
}