import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AgriculturalProduct {
  id: number;
  name: string;
  description: string;
  pricePerTon: number;
  availableStock: number;
  category: string;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<AgriculturalProduct[]> {
    return this.http.get<AgriculturalProduct[]>(`${this.apiUrl}`);
  }

  addProduct(product: AgriculturalProduct): Observable<AgriculturalProduct> {
    return this.http.post<AgriculturalProduct>(`${this.apiUrl}`, product);
  }

  updateProductStock(productId: number, newStock: number): Observable<any> {
    const body = { availableStock: newStock };
    console.log("Sending request to update stock:", productId, body);
    return this.http.put(`${this.apiUrl}/${productId}/updateStock`, body);
  }

}
