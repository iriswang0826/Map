var appRoot = '../';
var buildDir = appRoot + 'buildStatic';
var tmpDir = appRoot + 'tmp';


module.exports = {
  appRoot : appRoot ,
  buildDir : buildDir,
  tmpDir : tmpDir,
  browsersync: {
    staticServer: {
      server: {
        baseDir: appRoot,
        directory: true
      },
      open: 'local',
      port: 9000,
      files: [
        appRoot + 'css/**/*.css',
        appRoot + '/js/**/*.js',
        appRoot + 'images/**',
        appRoot + 'views/**/*.html',
      ]
    },
    //代理.net开发环境
    proxy: {
      port: 9999,
      proxy: {
          baseDir: appRoot,
          target: 'http://www.shiwangyun.com'
      },
      files: [
        appRoot + 'css/**/*.css',
        appRoot + '/js/**/*.js',
        appRoot + 'images/**',
        appRoot + 'views/**/*.cshtml'
      ]
    }
  },
  less:{
    src: appRoot + '/less/**/*.less',
    dest: appRoot +'/css/'
  },
  watch:{
    sprites: appRoot + "images/sprites/**/*.png",
    less: appRoot +'less/**/*.less'
  },
  delete:['concat','transport', buildDir, tmpDir],
  optimize:{
    css : {
      src: [tmpDir +'/css/**/*.css',tmpDir + '/js/**/*.css'],
      dest: buildDir
    },
    js:{
      src: [tmpDir +'/js/**/*.js',tmpDir + '/js/**/*.js'],
      dest:  buildDir,
      options: {}
    },
    images: {
      src:   [tmpDir +'/images/**/*.{jpg,jpeg,png,gif}',tmpDir + '/js/**/*.{jpg,jpeg,png,gif}'],
      dest: buildDir,
      options: {
        optimizationLevel: 3,
        progessive: true,
        interlaced: true
      }
    },
  }
};
