import { Component, Input } from '@angular/core';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { v4 as uuid } from 'uuid';
import { createReview } from 'src/graphql/mutations';
import { listReviews } from 'src/graphql/queries';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  user: CognitoUser | null = null;
  form: FormGroup = this.fb.group({
    title: [''],
    description: [''],
    video: [null],
  });

  constructor(private fb: FormBuilder, private auth: AuthService) {
    auth.user.subscribe((user) => {
      this.user = user;
    });

    if (!this.auth.user) {
      this.auth.googleSocialSignIn();
    }
  }

  ngOnInit(): void {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.form.patchValue({ video: file });
  }

  async onSubmit() {
    const { title, description, video } = this.form.value;
    const { key } = await Storage.put(`${uuid()}.mp4`, video, {
      contentType: 'video/mp4',
    });

    const review = {
      id: uuid(),
      uid: this.user?.getUsername(),
      title,
      description,
      video: key,
    };

    await API.graphql(graphqlOperation(createReview, { input: review }));
  }
}
