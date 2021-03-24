import { Component, EventEmitter, OnDestroy } from '@angular/core';

import { AppService } from './app.service';
import { takeUntil,filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  constructor(private appService: AppService) {}

  title = 'angular-nodejs-example';

  products: any[] = [];
  productCategories : any[] =[];
  uniqueCategories : any[] =[];
  productsCount = 0;
  filteredItems: any[] =[];
  filteredCategory : string = null;
  onFilterChange = new EventEmitter<any>();
  priceList: any[] = [
    
    { name: '0 - 100', value: '0 - 100', checked: false },
    { name: '100 - 500', value: '100 - 500', checked: false },
    { name: '500 - 1000', value: '500 - 1000', checked: false }
  ];

  destroy$: Subject<boolean> = new Subject<boolean>();
  ngOnInit() {
    this.getAllProducts();
    }

  getAllProducts() {
    this.appService.getProducts().pipe(takeUntil(this.destroy$)).subscribe((products: any[]) => {
		this.productsCount = products.length;
        this.products = products;
        this.getAllCategories(this.products)
        this.filteredItems = [...this.products];
    });
  }
  getAllCategories(products){
    this.productCategories = products.map(item => {
      return   item.category;
     })
    this.removeDuplicates(this.productCategories)
  }
  removeDuplicates(categories) {
    this.uniqueCategories= categories.reduce((item1,item2)=>{
      if(!item1.includes(item2)){
        item1.push(item2);
      }
    return item1;
  },[])
  console.log(this.uniqueCategories)
  };
  
  doRefresh(){
    this.filteredItems = this.products.filter((item) => {
      return item.category == this.filteredCategory;
    });
    let categorizedItems = this.filteredItems;
    let priceFilteredItems :any[] =[]
    this.priceList.forEach((price)=>{
      
        if(price.checked ){
          let selectedPrice = price.value;
        if (selectedPrice === "0 - 100" ) {
          console.log(selectedPrice)
          priceFilteredItems = priceFilteredItems.concat(categorizedItems.filter(x => {
                return  (x.price > 0 && x.price < 100)           
              })
          );
            console.log(categorizedItems.length)
            console.log("priceFilteredItems",priceFilteredItems.length )
        } 
         else if (selectedPrice === "100 - 500"  ) {  
          priceFilteredItems = priceFilteredItems.concat(categorizedItems.filter(x => {              
             return (x.price >= 100 && x.price < 500) 
            })
          );
          console.log(categorizedItems.length)
            console.log("priceFilteredItems",priceFilteredItems.length )
        }  
       else if (selectedPrice === '500 - 1000' ) {  
        priceFilteredItems = priceFilteredItems.concat(categorizedItems.filter(x => {                
               return (x.price >= 500 && x.price < 1000) })
          );
          console.log(categorizedItems.length)
          console.log("priceFilteredItems",priceFilteredItems.length )
        }
      }
    })
    console.log(priceFilteredItems)
    if(this.priceList.filter((x)=>{
     return x.checked === true
    }).length>0){
      this.filteredItems = priceFilteredItems;
    }
    
  }

  filterItemsByCategory(category ) {
    this.filteredCategory = category;
    this.doRefresh();
    console.log(this.filteredItems)
  }
  filterItemsByPrice(price ,products:any[]) {
    this.filteredItems = products.filter((item) => {
      return item.price == (price);
    })
    console.log(this.filteredItems)
  }
  
onPriceChecked(item) {
  this.priceList.find(
    filter => filter.name === item.name
  ).checked = !item.checked;
  console.log(this.priceList)
  //this.onPriceFilterChange(this.priceList)
  this.doRefresh();
}
onPriceFilterChange(priceList) {
  console.log("price" , priceList)
  priceList.forEach((price)=>{
    this.products.forEach((product)=>{ 
      if(price.checked && product.category === this.filteredCategory){
        let selectedPrice = price.value;
      if (selectedPrice === "0 - 100" ) {
        console.log(selectedPrice)
          this.filteredItems = this.products.filter(x => {
            if(x.category === this.filteredCategory)
            return  (x.price > 0 && x.price < 100) 
            
          });
          console.log(this.filteredItems)
      } 
       if (selectedPrice === "100 - 500"  ) {

          this.filteredItems = this.products.filter(x => {
            if(x.category === this.filteredCategory)
           return (x.price >= 100 && x.price < 500) 
          });

      }  
      if (selectedPrice === '500 - 1000' ) {

            this.filteredItems = this.products.filter(x => {
              if(x.category === this.filteredCategory)
             return (x.price >= 500 && x.price < 1000) })
      }
    }
    });
    
  })
    
}
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  
}
