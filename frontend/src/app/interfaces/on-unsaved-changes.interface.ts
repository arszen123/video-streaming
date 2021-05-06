import { Observable } from "rxjs";

export interface OnUnsavedChanges {
    onUnsavedChanges():  Observable<boolean | string> | boolean | string;
}
