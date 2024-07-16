import { Component, OnInit, ViewChild } from '@angular/core';
import { Present } from 'src/app/models/Present.model';
import { PresentService } from 'src/app/services/present.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderItemService } from 'src/app/services/orderItem.service';
import { OrderItem } from 'src/app/models/OrderItem.model';
import { OIDTO } from 'src/app/models/OIDTO.model';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { DonarsService } from 'src/app/services/donars.service';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css']
})
export class RaffleComponent implements OnInit {
  orderby:string="Featured";
  carts: OrderItem[] = [];
  presents!: Present[];
  userName: string = '';
  winners: string[] = [];
  winner: string = '';
  present: Present = new Present;
  oi: OIDTO = new OIDTO;
  searchValue: string = "";
  @ViewChild('dv') dv!:DataView;
  constructor(private presentService: PresentService,public donarService: DonarsService, private orderItemService: OrderItemService, private router: Router, private activatedRoute: ActivatedRoute) { }
  selectedCategory:any=null;
  categories: any[] = [
      { name: 'Woman', key: 'W' },
      { name: 'Men', key: 'M' },
      { name: 'Kids', key: 'K' },
      { name: 'Home', key: 'H' }
  ];

  orderBYs: SelectItem[] = [
    { label: 'Featured', value: 'Featured' },
    { label: 'Most Expensive', value: 'mostExpensive' },
    { label: 'Most Bought', value: 'mostBought' }
  ];
  userTickets: Present[] = [];
  ngOnInit() {
    this.activatedRoute.params.subscribe(d => this.userName = d['userName']);
    this.presentService.reloadPresents$.pipe(
      switchMap(() => this.presentService.getPresents(this.orderby)),
      switchMap(presents => {
        this.presents = presents;
        const donarObservables = this.presents.map(element =>
          this.donarService.getDonarById(element.donarId).pipe(
            tap(data => {
              element.donar = data;
            })
          )
        );
        return forkJoin(donarObservables);
      })
      ).subscribe();

  }
  applyFilter() {
    if (this.dv) {
      //this.dv.filterBy(this.searchValue, 'contains');
    }
  }
  onOrderbyChange() {
    this.presentService.getPresents(this.orderby).subscribe(
      presents => {
        this.presents = presents;
        const donarObservables = this.presents.map(element =>
          this.donarService.getDonarById(element.donarId).pipe(
            tap(data => {
              element.donar = data;
            })
          )
        );
        forkJoin(donarObservables).subscribe();
      }
    );
  }
  bycategory(category:string) {
    if (this.selectedCategory === category) {
      this.selectedCategory = null; 
    } else {
      this.selectedCategory = category; 
    }
    let c=0;
    for(let i=0;i<this.categories.length;i++){
      if(this.categories[i].name==category){
        c=i;
        break;
      }
    }
    this.presentService.getPresentsByCategory(c).subscribe(
      presents => {
        this.presents = presents;
        const donarObservables = this.presents.map(element =>
          this.donarService.getDonarById(element.donarId).pipe(
            tap(data => {
              element.donar = data;
            })
          )
        );
        forkJoin(donarObservables).subscribe();
      }
    );
  }
  addToCart(present: Present) {
        this.oi.presentId = present.presentId;
        this.oi.status = false;
        this.orderItemService.addToCart(this.oi).subscribe(data => {
          alert("Added to cart!");
        });
  }
  
  cart() {
    this.router.navigateByUrl('cart/'+this.userName);
  }


}
