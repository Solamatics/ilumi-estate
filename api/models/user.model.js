import mongoose from "mongoose";

//user schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter username"],
    },
    avatar: {
      type: String,
      default:"https://www.bing.com/images/search?view=detailV2&ccid=VUWv%2bjC3&id=696551A5D69A683D9F60C75E3692DFCA78BDC224&thid=OIP.VUWv-jC3jcODHYq-MHGIsgAAAA&mediaurl=https%3a%2f%2fvectorified.com%2fimages%2fgoogle-profile-icon-19.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.5545affa30b78dc3831d8abe307188b2%3frik%3dJMK9eMrfkjZexw%26pid%3dImgRaw%26r%3d0&exph=200&expw=200&q=Google+Profile+Icon&simid=607991662610416304&FORM=IRPRST&ck=2B5348ED82BC8FDD07E99227070249F2&selectedIndex=3"
    }
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
