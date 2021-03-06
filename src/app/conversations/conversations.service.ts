import {Injectable} from '@angular/core';

import {Observable} from 'rxjs/Observable';
import {TrelloHttpService} from '../services/trello-http.service';
import {HttpParams} from '@angular/common/http';
import {Card} from '../models/card';
import {map} from 'rxjs/operators';
import {Board} from '../models/board';


interface CardWithBoard extends Card {
  board: Partial<Board>;
}

export interface SearchResult {
  cards: CardWithBoard[];
}

@Injectable()
export class ConversationsService {

  constructor(
    private trelloHttpService: TrelloHttpService
  ) {
  }

  getCommentCards(cardId: string): Observable<MysteriousCardObject[]> {
    return this.trelloHttpService.get('cards/' + cardId + '/actions?filter=commentCard');
  }


  getCardsByUser(username: string, onlyPastMonth = false): Promise<CardWithBoard[]> {

    const base = `comment:"@${username}" is:open`;
    const searchQuery = onlyPastMonth ? `${base} edited:month` : base;

    const cardsUrl = '/search';
    return this.trelloHttpService.get<SearchResult>(cardsUrl, new HttpParams()
      .append('query', searchQuery)
      .append('card_board', 'true')
      .append('board_fields', 'closed')
      .append('cards_limit', '1000'))
      .pipe(
        map(it => it.cards),
        map(cards => cards.filter(card => !card.board.closed)),
      )
      .toPromise();
  }

}


export type MysteriousCardObject = any;

