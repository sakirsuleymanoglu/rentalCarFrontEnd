import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms'
import { Color } from 'src/app/models/color';
import { ColorService } from 'src/app/services/color.service';

@Component({
  selector: 'app-color-add',
  templateUrl: './color-add.component.html',
  styleUrls: ['./color-add.component.css']
})
export class ColorAddComponent implements OnInit {

  colorAddForm: FormGroup;
  color: Color;
  colors:Color[];
  emptyColors:Color[];

  constructor(
    private formBuilder: FormBuilder,
    private colorService: ColorService
  ) {}

  ngOnInit(): void {
    this.createBrandAddForm();
  }

  createBrandAddForm() {
    this.colorAddForm = this.formBuilder.group({
      name: ['', Validators.required],
    });
  }

  add() {
    if (this.colorAddForm.valid) {
      this.color = Object.assign({}, this.colorAddForm.value);
      this.colorService.add(this.color).subscribe((response) => {
        this.list();
      });
    }
  }

  list(){
    this.colorService.getColors().subscribe((response)=>{
      this.colors = response.data;
      return this.colors;
    });
  }

  deList(){
    this.colors = this.emptyColors;
  }

}
