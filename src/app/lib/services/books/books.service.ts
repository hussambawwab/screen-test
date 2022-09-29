import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Books } from '@lib/interfaces/books.interface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private dbPath = '/Books';

  booksRef: AngularFirestoreCollection<Books>;

  constructor(private firestore: AngularFirestore) {
    this.booksRef = firestore.collection(this.dbPath);
  }

  createBooks(book: Books) {
    return this.booksRef.add(book);
  }
  updateBooks(key: string, book: Books) {
    return this.booksRef.doc(key).update(book);
  }
  deleteBooks(key: string) {
    return this.booksRef.doc(key).delete();
  }
  getBooksById(key: any) {
    return this.booksRef
      .doc(key)
      .get()
      .pipe(map((changes) => changes.data()));
  }
  getBooks() {
    return this.booksRef
      .snapshotChanges()
      .pipe(map((changes) => changes.map((c) => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))));
  }
}
