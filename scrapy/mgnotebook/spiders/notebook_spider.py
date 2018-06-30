import scrapy
from mgnotebook.items import Product


class NotebookSpider(scrapy.Spider):
    name = 'notebook'

    start_urls = [
        'https://www.magazineluiza.com.br/notebook/informatica/s/in/note/', ]

    def parse(self, response):

        for href in response.css('li.product a::attr(href)'):
            yield response.follow(href, callback=self.parse_product)

        a = response.css('a.forward::attr(href)').extract_first()

        for a in response('a.forward'):
            yield response.follow(a, callback=self.parse)

    def parse_product(self, response):
        def extract_with_css(query):
            return response.css(query).extract_first().strip()

        product = Product()
        product['name'] =  extract_with_css('h1.header-product__title::text'),
        product['price'] = extract_with_css('span.price-template__text::text'),
        product['nota'] =  str(extract_with_css('span.product-review__rating-average::text').split(' ')[1]).replace(".","").replace(",",".")
        product['comments'] = [string for string in response.css('p.product-review__text-content::text').extract()]
        if not len(product['comments']):
            product['comments'] = ['Sem Comentarios']
        product['url'] = response.request.url
        product['img_url'] = response.css('div.showcase-product__container-img a::attr(href)').extract_first()    
        yield product

        