import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-color-update',
  templateUrl: './color-update.component.html',
  styleUrls: ['./color-update.component.css'],
})
export class ColorUpdateComponent implements OnInit {
  color: Color;
  updatedColor: Color;
  colors: Color[];
  isUpdate: boolean;
  formColorData: Color;
  formSelectedColorData: Color;
  colorUpdateForm: FormGroup;
  selectedColorUpdateForm: FormGroup;
  constructor(
    private colorService: ColorService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private messagesService: MessagesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['colorId']) {
        this.colorService.getColor(params['colorId']).subscribe((response) => {
          this.color = response.data;
          this.createSelectedUpdateColorForm();
        });
      } else {
        this.colorService.getColors().subscribe((response) => {
          this.colors = response.data;
        });
        this.createUpdateColorForm();
      }
    });
  }

  createUpdateColorForm() {
    this.colorUpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  createSelectedUpdateColorForm() {
    this.selectedColorUpdateForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  checkUpdate(color: Color) {
    this.updatedColor = color;
    this.isUpdate = true;
  }

  update() {
    if (this.colorUpdateForm.valid) {
      this.formColorData = Object.assign({}, this.colorUpdateForm.value);

      this.colorService.getColor(this.updatedColor.id).subscribe(
        (response) => {
          this.updatedColor = response.data;
          this.updatedColor.name = this.formColorData.name;
          this.colorService.update(this.updatedColor).subscribe((response) => {
            this.toastrService.success(response.message, 'Renk Güncelleme');
            this.list();
          });
        },
        (responseError) => {
          this.toastrService.error(
            responseError.error.message,
            'Marka Güncelleme'
          );
        }
      );
    } else {
      this.toastrService.error(
        this.messagesService.notNullMessage,
        'Marka Güncelleme'
      );
    }
  }

  list() {
    this.colorService.getColors().subscribe((response) => {
      this.colors = response.data;
    });
  }

  selectedColorUpdate() {
    if (this.selectedColorUpdateForm.value) {
      this.formSelectedColorData = Object.assign(
        {},
        this.selectedColorUpdateForm.value
      );
      this.color.name = this.formSelectedColorData.name;
      this.colorService.update(this.color).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Marka Güncelleme');
        },
        (responseError) => {
          this.toastrService.error(
            responseError.console.error.message,
            'Marka Güncelleme'
          );
        }
      );
    } else {
      this.toastrService.error(
        this.messagesService.notNullMessage,
        'Marka Güncelleme'
      );
    }
  }
}
