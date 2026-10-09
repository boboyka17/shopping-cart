using Api.Data;
using Api.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace Api.Seeds
{
    public class ProductsSeed
    {
        public static async Task SeedAsync(AppDbContext db)
        {
            var products = new List<Products>
        {
            new()
            {
                ProductsId = 1,
                ProductName = "Laptop",
                ProductPrice = 1000.00m,
                ProductImage = "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
            },
            new()
            {
                ProductsId = 2,
                ProductName = "Smartphone",
                ProductPrice = 699.00m,
                ProductImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
            },
            new()
            {
                ProductsId = 3,
                ProductName = "Headphones",
                ProductPrice = 199.00m,
                ProductImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
            },
            new()
            {
                ProductsId = 4,
                ProductName = "Keyboard",
                ProductPrice = 89.00m,
                ProductImage = "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500"
            },
            new()
            {
                ProductsId = 5,
                ProductName = "Mouse",
                ProductPrice = 49.00m,
                ProductImage = "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500"
            },
            new()
            {
                ProductsId = 6,
                ProductName = "Monitor",
                ProductPrice = 299.00m,
                ProductImage = "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500"
            },
            new()
            {
                ProductsId = 7,
                ProductName = "Tablet",
                ProductPrice = 450.00m,
                ProductImage = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500"
            },
            new()
            {
                ProductsId = 8,
                ProductName = "Camera",
                ProductPrice = 850.00m,
                ProductImage = "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
            },
            new()
            {
                ProductsId = 9,
                ProductName = "Smartwatch",
                ProductPrice = 250.00m,
                ProductImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
            },
            new()
            {
                ProductsId = 10,
                ProductName = "Speaker",
                ProductPrice = 120.00m,
                ProductImage = "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"
            }
        };

            foreach (var product in products)
            {
                var exists = await db.Products
                    .FirstOrDefaultAsync(x => x.ProductName == product.ProductName);

                if (exists == null)
                {
                    await db.Products.AddAsync(product);
                }
                else
                {
                    exists.ProductName = product.ProductName;
                    exists.ProductPrice = product.ProductPrice;
                    exists.ProductImage = product.ProductImage;
                }

            }


            await db.SaveChangesAsync();
        }

    }
}