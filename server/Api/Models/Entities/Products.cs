using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Api.Models.Entities
{
    public class Products
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductsId { get; set; }

        [MaxLength(255)]
        public string? ProductName { get; set; }

        [Precision(18, 4)]
        public decimal? ProductPrice { get; set; }

        [MaxLength(255)]
        public string? ProductImage { get; set; }



    }
}