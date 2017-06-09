import { Component, OnInit } from "@angular/core";

declare function require(path:string):any;

@Component({
  selector:'app-root',
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';


  ngOnInit() {

    const {remote} = require("electron");
    const {Menu, MenuItem} = remote;

    const menu = new Menu();
    menu.append(new MenuItem({
      label:'MenuItem1', click() {
        console.log('item 1 clicked');
      }
    }));
    menu.append(new MenuItem({type:'separator'}));
    menu.append(new MenuItem({label:'MenuItem2', type:'checkbox', checked:true}));

    console.log((<any>window).createjs);

    window.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      menu.popup(remote.getCurrentWindow());
    }, false);

  }
}
