import { Component, OnInit } from '@angular/core';
import { ProductService, AgriculturalProduct } from '../services/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {
  products: AgriculturalProduct[] = [];
  selectedProduct: AgriculturalProduct | null = null;
  quantityToSell: number = 0;
  restockQuantity: number = 0;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  selectProduct(product: AgriculturalProduct) {
    this.selectedProduct = { ...product };
  }

  sellProduct() {
    if (this.selectedProduct && this.quantityToSell > 0 && this.quantityToSell <= this.selectedProduct.availableStock) {
      const newStock = this.selectedProduct.availableStock - this.quantityToSell;
      this.productService.updateProductStock(this.selectedProduct.id, newStock).subscribe(() => {
        this.selectedProduct!.availableStock = newStock;
        this.updateLocalStock(this.selectedProduct!.id, newStock);
      });
      this.quantityToSell = 0;
    }
  }

  restockProduct() {
    if (this.selectedProduct && this.restockQuantity > 0) {
      const newStock = this.selectedProduct.availableStock + this.restockQuantity;
      this.productService.updateProductStock(this.selectedProduct.id, newStock).subscribe(() => {
        this.selectedProduct!.availableStock = newStock;
        this.updateLocalStock(this.selectedProduct!.id, newStock);
      });
      this.restockQuantity = 0;
    }
  }

  updateLocalStock(productId: number, newStock: number) {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      product.availableStock = newStock;
    }
  }
}
