import { Component, Input } from '@angular/core';
import { Storage, API, graphqlOperation } from 'aws-amplify';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { v4 as uuid } from 'uuid';
import { createReview } from 'src/graphql/mutations';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ToastType } from '../../services/toast.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
})
export class WriteReviewComponent {
  @Input() pid: string = '';
  user: CognitoUser | null = null;
  form: FormGroup = this.fb.group({
    review: [''],
    rating: [1],
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

    const { reviewText, rating, video } = this.form.value;
    const { key } = await Storage.put(`${uuid()}.mp4`, video, {
      contentType: 'video/mp4',
    });

    const review = {
      id: uuid(),
      pid: this.pid,
      uid: this.user.getUsername(),
      review: reviewText,
      rating: rating.toString(),
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

  setRating(rating: number) {
    this.form.patchValue({ rating });
  }
}
