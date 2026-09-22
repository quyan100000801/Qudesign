<?php
/* ============================================
   曲焱作品集 · 后端API
   适用于宝塔面板 + PHP 7.4+
   后台默认密码：admin123（请及时修改下方密码）
   ============================================ */

// ===== 配置（修改这里改密码）=====
define('ADMIN_PASSWORD', '88duoluo');
define('DATA_FILE', __DIR__ . '/data.js');
define('STATS_FILE', __DIR__ . '/stats.json');
define('UPLOAD_DIR', __DIR__ . '/uploads/');

// ===== 基础设置 =====
header('Content-Type: application/json; charset=utf-8');
session_start();

// 确保上传目录存在
if (!is_dir(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0755, true);
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

/* ===== 读取数据（从data.js提取JSON） ===== */
function readData() {
    if (!file_exists(DATA_FILE)) return null;
    $content = file_get_contents(DATA_FILE);
    // 提取 window.SITE_DATA = { ... }; 中的JSON
    if (preg_match('/window\.SITE_DATA\s*=\s*(\{.*?\});\s*$/s', $content, $m)) {
        $data = json_decode($m[1], true);
        return $data;
    }
    return null;
}

/* ===== 保存数据（写入data.js） ===== */
function writeData($data) {
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $content = "/* 站点数据 · 由后台管理自动生成，请勿手动修改 */\nwindow.SITE_DATA = " . $json . ";\n";
    return file_put_contents(DATA_FILE, $content) !== false;
}

/* ===== 读取统计 ===== */
function readStats() {
    if (!file_exists(STATS_FILE)) {
        return ['totalVisits' => 0, 'dailyVisits' => [], 'pageVisits' => []];
    }
    $content = file_get_contents(STATS_FILE);
    return json_decode($content, true) ?: ['totalVisits' => 0, 'dailyVisits' => [], 'pageVisits' => []];
}

/* ===== 写入统计 ===== */
function writeStats($stats) {
    return file_put_contents(STATS_FILE, json_encode($stats, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false;
}

/* ===== 检查是否已登录 ===== */
function checkAuth() {
    return !empty($_SESSION['admin_logged_in']);
}

/* ===== 路由 ===== */
switch ($action) {

    // 登录
    case 'login':
        $password = $_POST['password'] ?? '';
        if ($password === ADMIN_PASSWORD) {
            $_SESSION['admin_logged_in'] = true;
            echo json_encode(['ok' => true]);
        } else {
            http_response_code(401);
            echo json_encode(['ok' => false, 'msg' => '密码错误']);
        }
        break;

    // 退出
    case 'logout':
        session_destroy();
        echo json_encode(['ok' => true]);
        break;

    // 检查登录状态
    case 'check':
        echo json_encode(['loggedIn' => checkAuth()]);
        break;

    // 获取数据（需要登录）
    case 'get':
        if (!checkAuth()) { http_response_code(401); echo json_encode(['msg'=>'未登录']); break; }
        $data = readData();
        if ($data === null) {
            echo json_encode(['ok' => false, 'msg' => '数据文件读取失败']);
        } else {
            echo json_encode(['ok' => true, 'data' => $data]);
        }
        break;

    // 保存数据（需要登录）
    case 'save':
        if (!checkAuth()) { http_response_code(401); echo json_encode(['msg'=>'未登录']); break; }
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!$data) {
            echo json_encode(['ok' => false, 'msg' => '数据格式错误']);
            break;
        }
        // 保留统计字段不被覆盖
        $old = readData();
        if ($old && isset($old['stats'])) {
            $data['stats'] = $old['stats'];
        }
        if (writeData($data)) {
            echo json_encode(['ok' => true]);
        } else {
            echo json_encode(['ok' => false, 'msg' => '写入失败，请检查data.js文件权限（设为755或777）']);
        }
        break;

    // 图片/视频上传（需要登录）
    case 'upload':
        if (!checkAuth()) { http_response_code(401); echo json_encode(['msg'=>'未登录']); break; }
        if (empty($_FILES['file'])) {
            echo json_encode(['ok' => false, 'msg' => '没有文件']);
            break;
        }
        $file = $_FILES['file'];
        if ($file['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['ok' => false, 'msg' => '上传失败，错误码：' . $file['error']]);
            break;
        }
        // 限制类型
        $allowed = ['jpg','jpeg','png','gif','webp','mp4','webm'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowed)) {
            echo json_encode(['ok' => false, 'msg' => '不支持的文件类型：' . $ext]);
            break;
        }
        // 限制大小（50MB）
        if ($file['size'] > 50 * 1024 * 1024) {
            echo json_encode(['ok' => false, 'msg' => '文件超过50MB']);
            break;
        }
        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
        $dest = UPLOAD_DIR . $filename;
        if (move_uploaded_file($file['tmp_name'], $dest)) {
            echo json_encode(['ok' => true, 'url' => 'uploads/' . $filename]);
        } else {
            echo json_encode(['ok' => false, 'msg' => '保存失败，请检查uploads目录权限']);
        }
        break;

    // 记录访问（公开，前台调用）
    case 'visit':
        $stats = readStats();
        $stats['totalVisits'] = ($stats['totalVisits'] ?? 0) + 1;
        $today = date('Y-m-d');
        if (!isset($stats['dailyVisits'][$today])) {
            $stats['dailyVisits'][$today] = 0;
        }
        $stats['dailyVisits'][$today]++;
        $page = $_GET['page'] ?? 'index.html';
        if (!isset($stats['pageVisits'][$page])) {
            $stats['pageVisits'][$page] = 0;
        }
        $stats['pageVisits'][$page]++;
        writeStats($stats);
        echo json_encode(['ok' => true, 'total' => $stats['totalVisits']]);
        break;

    // 获取统计（需要登录）
    case 'stats':
        if (!checkAuth()) { http_response_code(401); echo json_encode(['msg'=>'未登录']); break; }
        $stats = readStats();
        echo json_encode(['ok' => true, 'stats' => $stats]);
        break;

    default:
        echo json_encode(['ok' => false, 'msg' => '未知操作：' . $action]);
}
