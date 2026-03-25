<?php

namespace GitList;

use Framework\Application as FrameworkApplication;
use Framework\Provider\TwigServiceProvider;
use GitList\Provider\GitServiceProvider;
use GitList\Provider\RepositoryUtilServiceProvider;
use GitList\Provider\ViewUtilServiceProvider;
use GitList\Provider\RoutingUtilServiceProvider;
use Symfony\Component\Filesystem\Filesystem;
use Twig\TwigFilter;
use Twig\TwigFunction;

/**
 * GitList application.
 */
class Application extends FrameworkApplication
{
    protected $path;

    /**
     * Constructor initialize services.
     *
     * @param Config $config
     * @param string $root Base path of the application files (views, cache)
     */
    public function __construct(Config $config, $root = null)
    {
        parent::__construct();
        $app = $this;
        $this->path = realpath($root);

        $string = file_get_contents("../package.json");
        $pkg = json_decode($string, true);

        $this['url_subdir'] = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
        if ($this['url_subdir'] === '/') {
            $this['url_subdir'] = '';
        }
        $this['debug'] = $config->get('app', 'debug');
        $this['date.format'] = $config->get('date', 'format') ? $config->get('date', 'format') : 'd/m/Y H:i:s';
        $this['theme'] = 'bootstrap';

        $titleBase = $config->get('app', 'title') ? $config->get('app', 'title') : 'P3X GitList';
        $this['title'] = $titleBase . ' v' . $pkg['version'];
        $this['filetypes'] = $config->getSection('filetypes');
        $this['binary_filetypes'] = $config->getSection('binary_filetypes');
        $this['cache.archives'] = $this->getCachePath() . 'archives';
        $this['avatar.url'] = $config->get('avatar', 'url');
        $this['avatar.query'] = $config->get('avatar', 'query');
        $this['show_http_remote'] = $config->get('clone_button', 'show_http_remote');
        $this['use_https'] = $config->get('clone_button', 'use_https');
        $this['ssh_clone_subdir'] = $config->get('clone_button', 'ssh_clone_subdir');
        $this['repo_paging'] = $config->get('app', 'repo_paging') !== false ? $config->get('app', 'repo_paging') : 10;

        if (!isset($_SERVER['PHP_AUTH_USER'])) {
            $_SERVER['PHP_AUTH_USER'] = '';
        }

        $this['http_user'] = $config->get('clone_button', 'http_user_dynamic') ? $_SERVER['PHP_AUTH_USER'] : $config->get('clone_button', 'http_user');

        $this['show_ssh_remote'] = $config->get('clone_button', 'show_ssh_remote');

        $this['ssh_user'] = $config->get('clone_button', 'ssh_user_dynamic') ? $_SERVER['PHP_AUTH_USER'] : $config->get('clone_button', 'ssh_user');

        $this['git_http_subdir_calculated'] = $config->get('clone_button', 'git_http_subdir_calculated') ? $config->get('clone_button', 'git_http_subdir_calculated') : true;
        $this['git_http_subdir'] = $config->get('clone_button', 'git_http_subdir') ? $config->get('clone_button', 'git_http_subdir') : '';
        $this['fixed_navbar'] = $config->get('app', 'fixed_navbar') ? $config->get('app', 'fixed_navbar') : true;

        // Register services
        $this->register(new TwigServiceProvider(), array(
            'twig.path' => array($this->getThemePath($this['theme'])),
            'twig.options' => $config->get('app', 'cache') ?
                array('cache' => $this->getCachePath() . 'views') : array(),
        ));

        $repositories = $config->get('git', 'repositories');
        $this['git.projects'] = $config->get('git', 'project_list') ?
            $this->parseProjectList($config->get('git', 'project_list')) :
            false;

        $this->register(new GitServiceProvider(), array(
            'config' => $config,
            'git.client' => $config->get('git', 'client'),
            'git.repos' => $repositories,
            'ini.file' => "config.ini",
            'git.hidden' => $config->get('git', 'hidden') ?
                $config->get('git', 'hidden') : array(),
            'git.default_branch' => $config->get('git', 'default_branch') ?
                $config->get('git', 'default_branch') : 'master',
            'git.strip_dot_git' => $config->get('git', 'strip_dot_git')
        ));

        $this->register(new ViewUtilServiceProvider());
        $this->register(new RepositoryUtilServiceProvider());
        $this->register(new RoutingUtilServiceProvider());

        $enable_editing = (boolean)$config->get('app', 'enable_editing');

        $this['twig'] = $this->extend('twig', function ($twig, $app) use ($pkg, $config, $enable_editing) {

            $twig->addFilter(new TwigFilter('to_id', function ($value) {
                $value = str_replace(['.', '/', '\\', ' '], '-', $value);
                $value = strtolower($value);
                return $value;
            }));

            $twig->addFilter(new TwigFilter('remove_extension', function ($string) {
                return pathinfo($string, PATHINFO_FILENAME);
            }));


            $twig->addFilter(new TwigFilter('htmlentities', 'htmlentities'));
            $twig->addFilter(new TwigFilter('md5', 'md5'));
            $twig->addFilter(new TwigFilter('format_date', array($app, 'formatDate')));
            $twig->addFilter(new TwigFilter('format_date_long', array($app, 'formatDateLong')));
            $twig->addFilter(new TwigFilter('format_size', array($app, 'formatSize')));
            $twig->addFunction(new TwigFunction('avatar', array($app, 'getAvatar')));

            // Language - follows same cookie pattern as theme
            $currentLang = isset($_COOKIE['p3x-gitlist-language']) ? $_COOKIE['p3x-gitlist-language'] : 'en';
            $langNames = [
                'af' => 'Afrikaans', 'ar' => 'العربية', 'bn' => 'বাংলা', 'ca' => 'Català',
                'cs' => 'Čeština', 'da' => 'Dansk', 'de' => 'Deutsch', 'el' => 'Ελληνικά',
                'en' => 'English', 'es' => 'Español', 'fi' => 'Suomi', 'fr' => 'Français',
                'he' => 'עברית', 'hu' => 'Magyar', 'it' => 'Italiano', 'ja' => '日本語',
                'ko' => '한국어', 'nl' => 'Nederlands', 'no' => 'Norsk', 'pl' => 'Polski',
                'pt' => 'Português', 'ro' => 'Română', 'ru' => 'Русский', 'sr' => 'Српски',
                'sv' => 'Svenska', 'tr' => 'Türkçe', 'uk' => 'Українська', 'vi' => 'Tiếng Việt',
                'zh' => '中文',
            ];
            $allowedLangs = array_keys($langNames);
            if (!in_array($currentLang, $allowedLangs)) {
                $currentLang = 'en';
            }
            $app['current_lang'] = $currentLang;

            $translationFile = $app->path . '/src/translation/' . $currentLang . '.json';
            $fallbackFile = $app->path . '/src/translation/en.json';
            $translations = [];
            if (file_exists($translationFile)) {
                $translations = json_decode(file_get_contents($translationFile), true) ?: [];
            }
            if ($currentLang !== 'en' && file_exists($fallbackFile)) {
                $fallback = json_decode(file_get_contents($fallbackFile), true) ?: [];
                $translations = array_merge($fallback, $translations);
            }

            $twig->addFilter(new TwigFilter('t', function ($key) use ($translations) {
                return $translations[$key] ?? $key;
            }));

            $twig->addGlobal('i18n_json', json_encode($translations, JSON_UNESCAPED_UNICODE));
            $twig->addGlobal('current_lang', $currentLang);
            $twig->addGlobal('allowed_langs', $allowedLangs);
            $twig->addGlobal('lang_names', $langNames);

            $currentTheme = !isset($_COOKIE['gitlist-bootstrap-theme']) ? 'bootstrap-cosmo' : $_COOKIE['gitlist-bootstrap-theme'];
            $themeDark = [
                'cyborg',
                'darkly',
                'slate',
                'superhero',
                'solar',
            ];

            $twig->addGlobal('theme_type', !in_array(substr($currentTheme, strlen('bootstrap-')), $themeDark) ? 'p3x-gitlist-light' : 'p3x-gitlist-dark');

            $twig->addGlobal('theme', $currentTheme);
            $query = isset($_REQUEST['query']) ? $_REQUEST['query'] : (isset($_COOKIE['p3x-gitlist-query']) ? $_COOKIE['p3x-gitlist-query'] : '');

            setcookie('p3x-gitlist-query', $query, 0, '/' . $this['url_subdir']);

            $_COOKIE['p3x-gitlist-query'] = $query;

            $twig->addGlobal('search_query', $query);

            $twig->addGlobal('theme_postfix', $pkg['corifeus']['css-postfix']);
            $twig->addGlobal('prod_dir', $pkg['corifeus']['prod-dir']);

            $twig->addGlobal('theme_dark', $themeDark);

            $twig->addGlobal('version', $pkg['version']);
            $twig->addGlobal('gitlist_date_format', $this['date.format']);


            $codemirror_full_limit = (int)$config->get('app', 'codemirror_full_limit');
            if (!is_int($codemirror_full_limit) || $codemirror_full_limit < 32) {
                $codemirror_full_limit = 32;
            }
            $twig->addGlobal('codemirror_full_limit', $codemirror_full_limit);
            $twig->addGlobal('enable_editing', $enable_editing ? 1 : 0);

            return $twig;
        });
        $this['enable_editing'] = $enable_editing ? 1 : 0;

        $this['escaper.argument'] = $this->factory(function () {
            return new Escaper\ArgumentEscaper();
        });

        // Handle errors
        $this->error(function (\Exception $e, $code) use ($app) {
            if ($app['debug']) {
                return;
            }

            return $app['twig']->render('error.twig', array(
                'message' => $e->getMessage(),
            ));
        });

        $this->finish(function () use ($app, $config) {
            if (!$config->get('app', 'cache')) {
                $fs = new Filesystem();
                $fs->remove($app['cache.archives']);
            }
        });
    }

    public function getCachePath()
    {
        return $this->path
            . DIRECTORY_SEPARATOR
            . 'cache'
            . DIRECTORY_SEPARATOR;
    }

    public function getThemePath($theme)
    {
        return $this->path
            . DIRECTORY_SEPARATOR
            . 'src'
            . DIRECTORY_SEPARATOR
            . 'twig'
            . DIRECTORY_SEPARATOR;
    }

    public function parseProjectList($project_list)
    {
        $projects = array();
        $file = fopen($project_list, "r");
        while ($file && !feof($file))
            $projects[] = trim(fgets($file));
        fclose($file);
        return $projects;
    }

    public function formatDate($date)
    {
        $lang = $this['current_lang'] ?? 'en';
        if (class_exists('IntlDateFormatter')) {
            $formatter = new \IntlDateFormatter(
                $lang,
                \IntlDateFormatter::MEDIUM,
                \IntlDateFormatter::MEDIUM,
                $this['date.timezone'] ?? null
            );
            return $formatter->format($date);
        }
        return $date->format($this['date.format']);
    }

    private static $monthNames = [
        'en' => ['January','February','March','April','May','June','July','August','September','October','November','December'],
        'hu' => ['január','február','március','április','május','június','július','augusztus','szeptember','október','november','december'],
        'de' => ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
        'fr' => ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
        'es' => ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'],
        'it' => ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'],
        'pt' => ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'],
        'nl' => ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'],
        'da' => ['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'],
        'sv' => ['januari','februari','mars','april','maj','juni','juli','augusti','september','oktober','november','december'],
        'no' => ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'],
        'fi' => ['tammikuu','helmikuu','maaliskuu','huhtikuu','toukokuu','kesäkuu','heinäkuu','elokuu','syyskuu','lokakuu','marraskuu','joulukuu'],
        'pl' => ['stycznia','lutego','marca','kwietnia','maja','czerwca','lipca','sierpnia','września','października','listopada','grudnia'],
        'cs' => ['ledna','února','března','dubna','května','června','července','srpna','září','října','listopadu','prosince'],
        'ro' => ['ianuarie','februarie','martie','aprilie','mai','iunie','iulie','august','septembrie','octombrie','noiembrie','decembrie'],
        'ru' => ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'],
        'uk' => ['січня','лютого','березня','квітня','травня','червня','липня','серпня','вересня','жовтня','листопада','грудня'],
        'tr' => ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
        'el' => ['Ιανουαρίου','Φεβρουαρίου','Μαρτίου','Απριλίου','Μαΐου','Ιουνίου','Ιουλίου','Αυγούστου','Σεπτεμβρίου','Οκτωβρίου','Νοεμβρίου','Δεκεμβρίου'],
        'ja' => ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        'ko' => ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        'zh' => ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
        'ar' => ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
        'he' => ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
        'vi' => ['tháng 1','tháng 2','tháng 3','tháng 4','tháng 5','tháng 6','tháng 7','tháng 8','tháng 9','tháng 10','tháng 11','tháng 12'],
        'bn' => ['জানুয়ারি','ফেব্রুয়ারি','মার্চ','এপ্রিল','মে','জুন','জুলাই','আগস্ট','সেপ্টেম্বর','অক্টোবর','নভেম্বর','ডিসেম্বর'],
        'ca' => ['gener','febrer','març','abril','maig','juny','juliol','agost','setembre','octubre','novembre','desembre'],
        'sr' => ['јануар','фебруар','март','април','мај','јун','јул','август','септембар','октобар','новембар','децембар'],
        'af' => ['Januarie','Februarie','Maart','April','Mei','Junie','Julie','Augustus','September','Oktober','November','Desember'],
    ];

    public function formatDateLong($date)
    {
        $lang = $this['current_lang'] ?? 'en';
        if (is_string($date)) {
            $date = new \DateTime($date);
        }
        $month = (int)$date->format('n') - 1;
        $day = $date->format('j');
        $year = $date->format('Y');
        $months = self::$monthNames[$lang] ?? self::$monthNames['en'];
        $monthName = $months[$month];

        // Language-specific date formats
        if (in_array($lang, ['hu'])) {
            return "$year. $monthName $day.";
        } elseif (in_array($lang, ['ja', 'ko', 'zh'])) {
            return "{$year}年{$monthName}{$day}日";
        } elseif (in_array($lang, ['de'])) {
            return "$day. $monthName $year";
        }
        return "$monthName $day, $year";
    }

    public function formatSize($bytes, $precision = 0)
    {
        $size = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        $factor = floor((strlen($bytes) - 1) / 3);
        return sprintf("%.{$precision}f", $bytes / pow(1024, $factor)) . @$size[$factor];
    }

    public function getAvatar($email, $size)
    {
        $url = $this['avatar.url'] ? $this['avatar.url'] : "//gravatar.com/avatar/";
        $query = array("s=$size");
        if (is_string($this['avatar.query']))
            $query[] = $this['avatar.query'];
        else if (is_array($this['avatar.query']))
            $query = array_merge($query, $this['avatar.query']);
        $id = md5(strtolower($email));
        return $url . $id . "?" . implode('&', $query);
    }

    public function getPath()
    {
        return $this->path . DIRECTORY_SEPARATOR;
    }

    public function setPath($path)
    {
        $this->path = $path;

        return $this;
    }
}
