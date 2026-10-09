using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Api.Models.Entities
{
    public class Stock
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int StockId { get; set; }

        public int Quantity { get; set; }

        public DateTime TransactionDate { get; set; }

        public int ProductId { get; set; }
        [ForeignKey(nameof(ProductId))]
        public Products? Products { get; set; } = null;

    }
}