import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Category } from '@lib/interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private dbPath = '/Categories';

  categoryRef: AngularFirestoreCollection<Category>;

  constructor(private firestore: AngularFirestore) {
    this.categoryRef = firestore.collection(this.dbPath);
  }

  createCategories(category: Category) {
    return this.categoryRef.add(category);
  }
  updateCategories(key: string, category: Category) {
    return this.categoryRef.doc(key).update(category);
  }
  deleteCategories(key: string) {
    return this.categoryRef.doc(key).delete();
  }
  getCategoryById(key: any) {
    return this.categoryRef
      .doc(key)
      .get()
      .pipe(map((changes) => changes.data()));
  }
  getCategories() {
    return this.categoryRef
      .snapshotChanges()
      .pipe(map((changes) => changes.map((c) => ({ id: c.payload.doc.id, ...c.payload.doc.data() }))));
  }
}
