import { Component, signal } from '@angular/core';
import { SiteService } from '../../services/site-service';
import { ICategory } from '../../models/data.model';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styles: ``,
})
export class Menu {
  constructor(public site:SiteService){}
  category_arr = signal<ICategory[]>([]);
  user:any = undefined;
  
  async ngOnInit() { 
    const resCategories = await this.site.getCategories(); // {success: true, data: [] }
    this.category_arr.set(resCategories.data as ICategory[]);
    this.layThongTinUser()
  }

  layThongTinUser() { 
    const user = sessionStorage.getItem('user') || "" ;
    if ( user!=="")  this.user = JSON.parse(user)
    else this.user = undefined 
  }


}
