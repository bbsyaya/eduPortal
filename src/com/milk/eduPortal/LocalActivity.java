package com.milk.eduPortal;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.webkit.*;
import android.widget.ImageView;
import android.widget.Toast;
import com.baidu.location.BDLocation;
import com.baidu.location.BDLocationListener;
import com.baidu.location.LocationClient;
import com.baidu.location.LocationClientOption;

public class LocalActivity extends Activity {
    WebView webView;
    CommonDialogLoading progressDialog;
    private LocationClientOption.LocationMode tempMode = LocationClientOption.LocationMode.Hight_Accuracy;
    private String tempcoor="gcj02";
    public LocationClient mLocationClient = null;
    public BDLocationListener myListener = new MyLocationListener();
    private String addr;

    private ImageView splashImg;
    private Handler mHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            splashImg.setVisibility(View.INVISIBLE);
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        setContentView(R.layout.activity_main);

        splashImg = (ImageView) findViewById(R.id.splashImg);
        webView = (WebView) findViewById(R.id.webView);

        new Thread(){
            @Override
            public void run() {
                super.run();
                try {
                    sleep(2000);
                    mHandler.sendEmptyMessage(0);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }.start();

        init();
//        webView.loadUrl("file:///android_asset/emobile/index.html#home");
        webView.loadUrl("file:///android_asset/emobile/index.html");

        mLocationClient = new LocationClient(getApplicationContext());     //声明LocationClient类
        mLocationClient.registerLocationListener( myListener );    //注册监听函数
        InitLocation();
        mLocationClient.start();
        mLocationClient.requestLocation();
    }

    private void init() {
        webView.setWebChromeClient(new WebViewChromeClientXY());
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setSupportZoom(false);
        webSettings.setAllowContentAccess(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAppCacheEnabled(true);
        webSettings.setDatabaseEnabled(true);


        webView.setWebViewClient(new WebViewClient(){
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }

        });

        webView.addJavascriptInterface(new GPS(),"android");


        progressDialog = new CommonDialogLoading(LocalActivity.this);
    }

    long exitTime=0;


    @Override
    public void onBackPressed() {

        if(webView.getUrl().contains("index.html")){
            exit();
            return;
        }

        if(webView.canGoBack()){
            webView.goBack();
        }else{
            exit();
        }
    }

    private void exit(){
        if((System.currentTimeMillis()-exitTime) > 2000){
            Toast.makeText(getApplicationContext(), "再按一次退出程序", Toast.LENGTH_SHORT).show();
            exitTime = System.currentTimeMillis();
            return;
        } else {
            finish();
            System.exit(0);
        }
    }

    private class WebViewChromeClientXY extends WebChromeClient {
        // 设置网页加载的进度条
        public void onProgressChanged(WebView view, int newProgress) {
//            try {
//                if (newProgress == 100) {
//                    progressDialog.dismiss();
//                } else {
//                    progressDialog.show();
//                }
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
        }

        // 获取网页的标题
        public void onReceivedTitle(WebView view, String title) {

        }

        // JavaScript弹出框
        @Override
        public boolean onJsAlert(WebView view, String url, String message,
                                 JsResult result) {
            return super.onJsAlert(view, url, message, result);
        }

        // JavaScript输入框
        @Override
        public boolean onJsPrompt(WebView view, String url, String message,
                                  String defaultValue, JsPromptResult result) {
            return super.onJsPrompt(view, url, message, defaultValue, result);
        }

        // JavaScript确认框
        @Override
        public boolean onJsConfirm(WebView view, String url, String message,
                                   JsResult result) {
            return super.onJsConfirm(view, url, message, result);
        }

    }

    public class MyLocationListener implements BDLocationListener {
        @Override
        public void onReceiveLocation(BDLocation location) {
            if (location == null)
                return ;
            StringBuffer sb = new StringBuffer(256);
            sb.append("time : ");
            sb.append(location.getTime());
            sb.append("\nerror code : ");
            sb.append(location.getLocType());
            sb.append("\nlatitude : ");
            sb.append(location.getLatitude());
            sb.append("\nlontitude : ");
            sb.append(location.getLongitude());
            sb.append("\nradius : ");
            sb.append(location.getRadius());
            if (location.getLocType() == BDLocation.TypeGpsLocation){
                sb.append("\nspeed : ");
                sb.append(location.getSpeed());
                sb.append("\nsatellite : ");
                sb.append(location.getSatelliteNumber());
            } else if (location.getLocType() == BDLocation.TypeNetWorkLocation){
                sb.append("\naddr : ");
                sb.append(location.getAddrStr());
            }
            Log.d("location",sb.toString());
            addr = location.getAddrStr();
        }
    }

    private void InitLocation(){
        int span= 60000;
        LocationClientOption option = new LocationClientOption();
        option.setLocationMode(tempMode);//设置定位模式
        option.setCoorType(tempcoor);//返回的定位结果是百度经纬度，默认值gcj02
        option.setScanSpan(span);//设置发起定位请求的间隔时间为5000ms
        option.setIsNeedAddress(true);
        mLocationClient.setLocOption(option);
    }

    @Override
    protected void onStop() {
        super.onStop();
        mLocationClient.stop();
    }

    private final class GPS{
        public String getLocation(){
            return addr;
        }
    }
}
