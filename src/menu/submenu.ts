import { Component, ContentChild, Host, Input, OnInit, TemplateRef } from '@angular/core'
import { dropAnimation } from '../shared/animation'
import { ElMenu } from './menu'

@Component({
  selector: 'el-submenu',
  animations: [dropAnimation],
  template: `
    <li [class.el-submenu]="true"
      [class.is-active]="active"
      [class.is-opened]="opened"
      (mouseenter)="mouseenterHandle()"
      (mouseleave)="mouseleaveHandle()">
      <div class="el-submenu__title" (click)="clickHandle()"
        [ngStyle]="{ paddingLeft: '20px;', color: rootMenu.textColor || '', borderBottomColor: borderColor() }"
        #subTitle
        (mouseenter)="subTitle.style.backgroundColor = rootMenu.hoverBackgroundColor()"
        (mouseleave)="subTitle.style.backgroundColor = ''">
        <ng-container *ngIf="!titleTmp">
          {{title}}
        </ng-container>
        <ng-container *ngIf="titleTmp">
          <ng-template [ngTemplateOutlet]="titleTmp"></ng-template>
        </ng-container>
        <i class="el-submenu__icon-arrow"
          [class.el-icon-caret-bottom]="rootMenu.mode === 'horizontal'"
          [class.el-icon-arrow-down]="rootMenu.mode === 'vertical'"></i>
      </div>
      <ul class="el-menu" [@dropAnimation]="opened"
        [ngStyle]="{ backgroundColor: rootMenu.backgroundColor || '' }">
        <ng-content></ng-content>
      </ul>
    </li>
  `,
})
export class ElSubmenu implements OnInit {
  
  @ContentChild('title') titleTmp: TemplateRef<any>
  
  @Input() index: string
  @Input() title: string
  
  timer: any
  opened: boolean = false
  active: boolean = false
  subActive: boolean = false
  dontUserHover: boolean = false
  
  constructor(
    @Host() public rootMenu: ElMenu,
    ) {
  }
  
  mouseenterHandle(): void {
    this.active = true
    if (this.dontUserHover) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.rootMenu.openMenu(this.index)
      this.updateOpened()
      clearTimeout(this.timer)
    }, 300)
  }
  
  mouseleaveHandle(): void {
    this.active = false
    if (this.dontUserHover) return
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.rootMenu.closeMenu(this.index)
      this.updateOpened()
      clearTimeout(this.timer)
    }, 300)
  }
  
  selectHandle(path: string): void {
    this.rootMenu.selectHandle(this.index, path)
    // selected and close list
    if (this.rootMenu.mode !== 'vertical') {
      this.rootMenu.closeMenu(this.index)
    }
    this.updateOpened()
  }
  
  updateOpened(): void {
    this.opened = this.rootMenu.openedMenus.indexOf(this.index) > -1
  }
  
  clickHandle(): void {
    if (!this.dontUserHover) return
    if (this.opened) {
      this.rootMenu.closeMenu(this.index)
    } else {
      this.rootMenu.openMenu(this.index)
    }
    this.updateOpened()
  }
  
  borderColor(): string {
    return this.rootMenu.showBorderIndex === this.index ?
      (this.rootMenu.activeTextColor ? this.rootMenu.activeTextColor : '#409eff')
      : 'transparent'
  }
  
  ngOnInit(): void {
    this.updateOpened()
    this.active = this.index === this.rootMenu.model
    this.dontUserHover = this.rootMenu.mode === 'vertical' || this.rootMenu.menuTrigger !== 'hover'
  }
  
}
