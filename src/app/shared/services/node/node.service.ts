import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPaths } from 'src/app/shared/enums/api/api-paths.enums';

@Injectable({
    providedIn: 'root'
})
export class NodeService {

    constructor(private http: HttpClient) { }

    getGenNodeData(collection_id: string, device_id: string, template_id: string): Observable<any> {
        return this.http.post<any>(ApiPaths.GET_GEN_NODE_DATA, {
            collection_id,
            device_id,
            template_id
        });
    }
}
