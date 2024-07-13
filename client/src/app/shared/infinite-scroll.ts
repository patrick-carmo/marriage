import { OnInit, Injectable, inject } from '@angular/core';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export abstract class InfiniteScroll<T> implements OnInit {
  private readonly utilsService = inject(UtilsService);

  protected items: T[] = [];
  protected page: number = 1;
  protected limit: number = 10;
  protected totalPages: number = 1;
  protected infiniteDisabled: boolean = false;

  protected abstract responseKey: string;
  protected abstract fetchData(): any;

  async ngOnInit() {
    await this.generateItems();
  }

  async generateItems(method: 'push' | 'unshift' = 'push') {
    this.fetchData().subscribe(
      (response: any) => {
        this.items[method](...response[this.responseKey]);
        this.totalPages = response.pages;
        this.page++;
      },
      async () => {
        await this.utilsService.showToast({
          header: 'Erro',
          message: 'Erro interno. Tente novamente mais tarde.',
          color: 'danger',
          duration: 4000,
        });
      }
    );
  }

  async onIonInfinite(ev: any) {
    if (this.page > this.totalPages) {
      this.infiniteDisabled = true;
      await this.utilsService.showToast({ message: 'Não há mais itens.' });
      return;
    }

    await this.generateItems();

    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 2000);
  }

  async handleRefresh(event: any) {
    setTimeout(async () => {
      this.items = [];
      this.page = 1;

      await this.generateItems();
      this.infiniteDisabled = false;

      event.target.complete();
    }, 1000);
  }
}
