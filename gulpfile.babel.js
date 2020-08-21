//HTML
import htmlmin from 'gulp-htmlmin'

//CSS
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';

//JavaScipt
import gulp from 'gulp'
import babel from 'gulp-babel'
import terser from 'gulp-terser'

//PUG
import pug from 'gulp-pug';

//SASS
import sass from 'gulp-sass';

//Common
import concat from 'gulp-concat'

//Clean CSS
import clean from 'gulp-purgecss'

//Cache bust, limpia la cache
import cacheBust from 'gulp-cache-bust'

//Optimización imagenes
import imagemin from 'gulp-imagemin'

//Browser sync
import {init as server, stream, reload} from 'browser-sync'

//Plumber
import plumber from 'gulp-plumber'

//variables/constantes
const cssPlugins = [
    cssnano(),
    autoprefixer()
]
const production = false

gulp.task('html-min', () =>{
    return gulp
        .src('./src/*.html')
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./public'))
});

gulp.task('styles', () =>{
    return gulp
        .src('./src/css/*.css')
        .pipe(plumber())
        .pipe(concat('styles-min.css'))
        .pipe(postcss(cssPlugins))
        .pipe(gulp.dest('./public/css'))
        .pipe(stream())
});
//Actualiza el código a una versión apta para todos los navegadores
gulp.task('babel', () =>{
    return gulp
        .src('./src/js/*.js')
        .pipe(plumber())
        //.pipe(concat('scripts-min.js'))
        .pipe(babel())
        //.pipe(terser()) //Minifica el código
        .pipe(gulp.dest('./public/js'))
});

gulp.task('views', () =>{
    return gulp
        .src('./src/views/pages/*.pug')
        .pipe(plumber())     
        .pipe(pug({
            pretty: production ? false : true
        }))  
        .pipe(cacheBust({
            type: 'timestamp'
        }))      
        .pipe(gulp.dest('./public'))
})

gulp.task('sass', () =>{
    return gulp
        .src('./src/scss/styles.scss')
        .pipe(plumber())        
        .pipe(sass({
            outputStyle: 'nested' //compresd
        }))           
        .pipe(gulp.dest('./public/css'))
        .pipe(stream())
})

gulp.task('clean', () =>{
    return gulp
        .src('./public/css/styles.css')
        .pipe(plumber())
        .pipe(clean({
            content: ['./public/*.html']
        }))  
        .pipe(gulp.dest('./public/css'))
})

gulp.task('imgmin', () => {
    return gulp
      .src('./src/images/*')
      .pipe(plumber()) 
      .pipe(imagemin([
          //imagemin.gifsicle({ interlaced: true }), //No funciona
          imagemin.mozjpeg({ quality: 30, progressive: true }),
          imagemin.optipng({ optimizationLevel: 1 })
        ])
      )
      .pipe(gulp.dest('./public/images'));
  });

//Se ejecutará cada vez que hagamos un cambio
gulp.task('default', ()=>{
    server({
        server: './public'
    })
    //gulp.watch('./src/*.html', gulp.series('html-min')).on('change', reload)
    //gulp.watch('./src/css/*.css', gulp.series('styles'))
    gulp.watch('./src/views/**/*.pug', gulp.series('views')).on('change', reload)
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/js/*.js', gulp.series('babel')).on('change', reload)
})