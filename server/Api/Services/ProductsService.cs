using Api.Data;
using Api.Models.Api;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api.Services
{
    public class ProductsService
    {
        private readonly Data.AppDbContext _dbContext;

        public ProductsService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ProductsResponse>> GetAllAsync()
        {
            var products = await _dbContext.Products.ToListAsync();
            var response = products.Select(p => new ProductsResponse
            {
                ProductsId = p.ProductsId,
                ProductName = p.ProductName,
                ProductPrice = p.ProductPrice,
                ProductImage = p.ProductImage,
                Quantity = _dbContext.Stocks.FirstOrDefault(s => s.ProductId == p.ProductsId)?.Quantity ?? 0
            }).ToList();

            return response;
        }

        public async Task<ActionResult<bool>> ConfirmOrderAsync(PaymentRequest[] request)
        {
            foreach (var item in request)
            {
                var stock = await _dbContext.Stocks.FirstOrDefaultAsync(s => s.ProductId == item.ProductsId);
                if (stock != null)
                {
                    stock.Quantity -= item.Quantity ?? 0;
                    _dbContext.Stocks.Update(stock);
                }
            }

            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}