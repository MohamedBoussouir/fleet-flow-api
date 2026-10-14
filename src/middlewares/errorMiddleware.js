const errorMiddleware = (err, req, res, next) => {
    // 1. التقاط خطأ JSON التالف
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: "Format JSON invalide ou malformé."
        });
    }

    // 2. التقاط خطأ الـ ObjectId غير الصالح
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        return res.status(400).json({
            success: false,
            message: `Format d'identifiant (ID) invalide : ${err.value}`
        });
    }

    // تسجيل الخطأ في الكونسول للتتبع
    console.error("Erreur capturée par errorMiddleware:", err);

    // التأكد من أن الكائن res موجود قبل محاولة قراءة أو كتابة الحالة
    if (!res || typeof res.status !== 'function') {
        console.error("L'objet de réponse (res) n'est pas disponible !");
        return;
    }

    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    
    return res.status(statusCode).json({
        success: false,
        message: err.message || 'Erreur interne du serveur'
    });
};

module.exports = errorMiddleware;