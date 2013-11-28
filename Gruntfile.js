module.exports = function(grunt) {

  'use strict';

  var APP_NAME        = 'Sarissa',
      DIR_HBS         = 'src/hbs',
      FILES_HBS       = grunt.file.expand({filter: 'isFile'}, DIR_HBS + '/**/*.hbs'),
      FILES_PROCESSD  = grunt.util._.map(FILES_HBS, function(path) {
        return path.replace(/.hbs$/, '.js').replace(DIR_HBS, 'temp/hbs');
      }),
      FILES_PAIR_FOR_HBS    = grunt.util._.object(FILES_PROCESSD, FILES_HBS);

  var RE_USE_STRICT_STATEMENT = /(^|\n)[ \t]*('use strict'|"use strict");?\s*/g,
      RE_CONSOLE_METHODS      = /console.[\w]+\(.*?(\w*\(.*\))*\);/g,
      BANNER_TEMPLATE_STRING  = '/*! <%= pkg.name %> - v<%= pkg.version %> ( <%= grunt.template.today("yyyy-mm-dd") %> ) - <%= pkg.license %> */',
      BUILD_ORDERED_LIST_APP  = [
        'src/app/config.js',
        'src/app/utils/**/*.js',
        'src/app/models/**/*.js',
        'src/app/components/_base.js',
        'src/app/components/**/*.js',
        'src/app/views/_base.js',
        'src/app/views/**/*.js',
        'src/app/layouts/_base.js',
        'src/app/layouts/**/*.js',
        'src/app/main.js'
      ],
      BUILD_ORDERED_LIST_LIB = [
        'src/lib/zepto/zepto.js',
        'src/lib/lodash/dist/lodash.js',
        'src/lib/backbone/backbone.js',
        'src/lib/phalanx/dist/phalanx.debug.js',
        'src/lib/handlebars/handlebars.runtime.js'
      ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // Configuration to be run (and then tested)
    watch: {
      sass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['compass:debug']
      },
      js: {
        files: BUILD_ORDERED_LIST_APP,
        tasks: ['concat:debug']
      },
      hbs: {
        files: [DIR_HBS + '/**/*.hbs'],
        tasks: ['handlebars:dist', 'concat:hbs']
      }
    },
    // CONCATENATE JavaScript files with preprocessing
    concat: {
      options: {
        stripBanners: true,
        banner: [BANNER_TEMPLATE_STRING,
          '(function(window) {',
          '',
          '\'use strict\';',
          '',
          ''].join('\n'),
        footer: ['',
          '})(this);'].join('\n')
      },
      debug: {
        src: BUILD_ORDERED_LIST_APP,
        dest: 'temp/app.debug.js',
        options: {
          process: function(content) {
            return content.replace(RE_USE_STRICT_STATEMENT, '$1');
          }
        }
      },
      app: {
        src: BUILD_ORDERED_LIST_APP,
        dest: 'temp/app.js',
        options: {
          process: function(content) {
            return content.replace(RE_USE_STRICT_STATEMENT, '$1').replace(RE_CONSOLE_METHODS, '');
          }
        }
      },
      libs: {
        src: BUILD_ORDERED_LIST_LIB,
        dest: 'temp/libs.js',
        options: {
          stripBanners: true,
          banner: '',
          footer: ''
        }
      },
      hbs: {
        src: FILES_PROCESSD,
        dest: 'temp/hbs.js',
        options: {
          stripBanners: false,
          banner: '',
          footer: ''
        }
      },
      dist: {
        // hbsを先に結合すること
        src: ['temp/hbs.js', 'temp/app.js'],
        dest: 'temp/app-hbs.js',
        options: {
          stripBanners: false,
          banner: '',
          footer: ''
        }
      }
    },
    // Precompile handlebar files to compiled function
    handlebars: {
      dist: {
        options: {
          namespace: APP_NAME + '.Template',
          processContent: function(hbs) {
            hbs = hbs.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
            hbs = hbs.replace(/^[\r\n]+/, '').replace(/[\r\n]+$/, '');
            return hbs;
          },
          processName: function(fname) {
            return fname.replace(DIR_HBS + '/', '').replace('.hbs', '');
          },
          processPartialName: function(fname) {
            return fname.replace(DIR_HBS + '/', '').replace('.hbs', '');
          },
          partialsUseNamespace: true
        },
        files: FILES_PAIR_FOR_HBS
      }
    },
    // Minify JavaScripts
    uglify: {
      options: {
        report: 'min',
        preserveComments: 'some'
      },
      dist: {
        files: {
          'js/app-hbs.min.js': ['temp/app-hbs.js']
        }
      },
      libs: {
        files: {
          'js/libs.min.js': ['temp/libs.js']
        }
      }
    },
    compass: {
      options: {
        httpGeneratedImagesPath: '/img',
        specify: 'src/sass/main.scss',
        imagesDir: '../',
        sassDir: 'src/sass',
        cssDir: 'temp'
      },
      debug: {
        options: {}
      }
    },
    csso: {
      compress: {
        options: {
          report: 'gzip'
        },
        files: {
          'css/main.min.css': ['temp/main.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-csso');

  grunt.registerTask('jsbuild', [
    'handlebars:dist',
    'concat:libs',
    'concat:hbs',
    'concat:app',
    'concat:dist',
    'uglify:libs',
    'uglify:dist'
  ]);

  grunt.registerTask('cssbuild', [
    'compass',
    'csso'
  ]);

  grunt.registerTask('build', [
    'jsbuild',
    'cssbuild'
  ]);

  grunt.registerTask('devel', [
    'handlebars:dist',
    'concat:libs',
    'concat:hbs',
    'concat:debug',
    'compass',
    'watch'
  ]);

};
