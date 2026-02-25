from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import requests
from bs4 import BeautifulSoup
from .models import Link, Category, Tag, Collection, Note
from .serializers import LinkSerializer, CategorySerializer, TagSerializer, CollectionSerializer, NoteSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fetch_page_title(request):
    """Obtiene el título de una página web dada su URL"""
    url = request.data.get('url')
    
    if not url:
        return Response({'error': 'URL requerida'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Asegurar que tenga protocolo
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        response.raise_for_status()
        
        # Parsear HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Intentar obtener el título
        title = None
        
        # Primero intentar con og:title (mejor para redes sociales)
        og_title = soup.find('meta', property='og:title')
        if og_title and og_title.get('content'):
            title = og_title['content'].strip()
        
        # Si no hay og:title, usar el tag <title>
        if not title:
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.get_text().strip()
        
        if title:
            return Response({'title': title})
        else:
            return Response({'error': 'No se encontró título'}, status=status.HTTP_404_NOT_FOUND)
            
    except requests.exceptions.Timeout:
        return Response({'error': 'Timeout al obtener la página'}, status=status.HTTP_408_REQUEST_TIMEOUT)
    except requests.exceptions.RequestException as e:
        return Response({'error': f'Error al obtener la página: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Error inesperado: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Create your views here.
class LinkViewSet(viewsets.ModelViewSet):
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user).order_by('position', '-created_at')

    def perform_create(self, serializer):
        # Asignar posición automática al crear
        max_position = Link.objects.filter(user=self.request.user).count()
        serializer.save(user=self.request.user, position=max_position)

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reordena los links según el array de IDs recibido"""
        order = request.data.get('order', [])
        for index, link_id in enumerate(order):
            Link.objects.filter(id=link_id, user=request.user).update(position=index)
        return Response({'status': 'ok'})


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).order_by('position')

    def perform_create(self, serializer):
        max_position = Category.objects.filter(user=self.request.user).count()
        serializer.save(user=self.request.user, position=max_position)

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reordena las categorías según el array de IDs recibido"""
        order = request.data.get('order', [])
        for index, cat_id in enumerate(order):
            Category.objects.filter(id=cat_id, user=request.user).update(position=index)
        return Response({'status': 'ok'})


class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(user=self.request.user).order_by('position')

    def perform_create(self, serializer):
        max_position = Collection.objects.filter(user=self.request.user).count()
        serializer.save(user=self.request.user, position=max_position)

    @action(detail=False, methods=['post'])
    def reorder(self, request):
        """Reordena las colecciones según el array de IDs recibido"""
        order = request.data.get('order', [])
        for index, col_id in enumerate(order):
            Collection.objects.filter(id=col_id, user=request.user).update(position=index)
        return Response({'status': 'ok'})


class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)