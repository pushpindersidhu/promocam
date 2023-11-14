import { Component, Input } from '@angular/core';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { v4 as uuid } from 'uuid';
import { createReview } from 'src/graphql/mutations';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ToastType } from '../services/toast.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  pid: string = '';
  user: CognitoUser | null = null;
  form: FormGroup = this.fb.group({
    title: [''],
    description: [''],
    video: [null],
  });

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
    this.auth.checkInitialLoginStatus();
    this.auth.user.subscribe((user) => {
      this.user = user;
    });

    this.pid = this.route.snapshot.paramMap.get('pid') as string;
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ video: file });
  }

  async onSubmit() {
    if (!this.user) {
      this.toast.show({
        msg: 'You must be signed in to upload a review.',
        type: ToastType.ERROR,
      });
      return;
    }

    const { title, description, video } = this.form.value;
    const { key } = await Storage.put(`${uuid()}.mp4`, video, {
      contentType: 'video/mp4',
    });

    const review = {
      id: uuid(),
      pid: this.pid,
      uid: this.user.getUsername(),
      title,
      description,
      video: key,
    };

    const result = await API.graphql(
      graphqlOperation(createReview, { input: review })
    );

    console.log('result: ', result);

    if (result) {
      this.toast.show({
        msg: 'Review uploaded successfully.',
        type: ToastType.SUCCESS,
      });
    }
  }
}
