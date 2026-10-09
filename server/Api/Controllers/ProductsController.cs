using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Api.Models.Api;
using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductsService _productsService;

        public ProductsController(ProductsService productsService)
        {
            _productsService = productsService;
        }

        // GET: api/<Products>
        [HttpGet]
        public Task<List<ProductsResponse>> Get()
        {
            return _productsService.GetAllAsync();
        }

        // POST: api/<Products>
        [HttpPost("confirm")]
        public Task<ActionResult<bool>> Post(PaymentRequest[] request)
        {
            return _productsService.ConfirmOrderAsync(request);
        }

    }
}