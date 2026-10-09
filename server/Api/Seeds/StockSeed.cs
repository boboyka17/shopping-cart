using Api.Data;
using Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Seeds
{
    public class StockSeed
    {
        public static async Task SeedAsync(AppDbContext db)
        {
            var stocks = new List<Stock>
        {
            new()
            {
                ProductId = 1,
                Quantity = 10,
                TransactionDate = DateTime.UtcNow
            },
            new()
            {
                ProductId = 2,
                Quantity = 25,
                TransactionDate = DateTime.UtcNow
            },
            new()
            {
                ProductId = 3,
                Quantity = 23,
                TransactionDate = DateTime.UtcNow
            },
            new()
            {
                ProductId = 4,
                Quantity = 10,
                TransactionDate = DateTime.UtcNow
            },
            new()
            {
                ProductId = 5,
                Quantity = 24,
                TransactionDate = DateTime.UtcNow

            },
            new()
            {
                ProductId = 6,
                Quantity = 52,
                TransactionDate = DateTime.UtcNow
            },
            new()
            {
                ProductId = 7,
                Quantity = 2,
                TransactionDate = DateTime.UtcNow
            },
            new()
           {
                ProductId = 8,
                Quantity = 0,
                TransactionDate = DateTime.UtcNow
            },
            new()
       {
                ProductId = 9,
                Quantity = 1,
                TransactionDate = DateTime.UtcNow
            },
            new()
         {
                ProductId = 10,
                Quantity = 15,
                TransactionDate = DateTime.UtcNow
            },
        };

            foreach (var stock in stocks)
            {
                var exists = await db.Stocks
                    .FirstOrDefaultAsync(x => x.ProductId == stock.ProductId);

                if (exists == null)
                {
                    await db.Stocks.AddAsync(stock);
                }
                else
                {
                    exists.Quantity = stock.Quantity;
                }

            }


            await db.SaveChangesAsync();
        }

    }
}