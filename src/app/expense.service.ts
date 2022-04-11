import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  url:any ='https://eikyz5cux7.execute-api.us-east-2.amazonaws.com/prod/expenses';
  constructor(private http: HttpClient) { }
  public getExpense(): Observable<any> {
  
    return this.http.get(this.url).pipe(map((res :any)=> res));
  }
  public deleteExpense(id:any){
 
    return this.http.delete(this.url,{ body:{expenseId:id}}).pipe(map((res :any)=> res));
  }
  public formatDate(date:any) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('-');
}
public formatDateReverse(date:any) {


  return date.substring(6, 11)+'-'+date.substring(3, 5)+'-'+ date.substring(0, 2);
}
  public addExpense(expense:any):Observable<any>{
    const headers = new HttpHeaders();
    let expenseObject = {
      'id':11,
      "type":expense.expensetype,
      "amount":parseInt(expense.expense),
      "date":this.formatDate(expense.date)
    }
   return this.http.put(this.url,expenseObject).pipe(map((res :any)=> res));
  }
}
